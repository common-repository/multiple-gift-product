<?php
/**
 * Order details table shown in emails.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-order-details.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates/Emails
 * @version 3.3.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$text_align = is_rtl() ? 'right' : 'left';

do_action( 'woocommerce_email_before_order_table', $order, $sent_to_admin, $plain_text, $email ); ?>

<h2>dsdsdsds
	<?php
	if ( $sent_to_admin ) {
		$before = '<a class="link" href="' . esc_url( $order->get_edit_order_url() ) . '">';
		$after  = '</a>';
	} else {
		$before = '';
		$after  = '';
	}
	/* translators: %s: Order ID. */
	echo wp_kses_post( $before . sprintf( __( 'Order #%s', 'woocommerce' ) . $after . ' (<time datetime="%s">%s</time>)', $order->get_order_number(), $order->get_date_created()->format( 'c' ), wc_format_datetime( $order->get_date_created() ) ) );
	?>
</h2>

<div style="margin-bottom: 40px;">
	<table class="td" cellspacing="0" cellpadding="6" style="width: 100%; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" border="1">
		<thead>
			<tr>
				<th class="td" scope="col" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php esc_html_e( 'Product', 'woocommerce' ); ?></th>
				<th class="td" scope="col" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php esc_html_e( 'Quantity', 'woocommerce' ); ?></th>
				<th class="td" scope="col" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php esc_html_e( 'Price', 'woocommerce' ); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php
			echo wc_get_email_order_items( $order, array( // WPCS: XSS ok.
				'show_sku'      => $sent_to_admin,
				'show_image'    => false,
				'image_size'    => array( 32, 32 ),
				'plain_text'    => $plain_text,
				'sent_to_admin' => $sent_to_admin,
			) );
			?>
		</tbody>
		<tfoot>
			<?php
			$totals = $order->get_order_item_totals();

			if ( $totals ) {
				$i = 0;
				foreach ( $totals as $total ) {
					$i++;
					?>
					<tr>
						<th class="td" scope="row" colspan="2" style="text-align:<?php echo esc_attr( $text_align ); ?>; <?php echo ( 1 === $i ) ? 'border-top-width: 4px;' : ''; ?>"><?php echo wp_kses_post( $total['label'] ); ?></th>
						<td class="td" style="text-align:<?php echo esc_attr( $text_align ); ?>; <?php echo ( 1 === $i ) ? 'border-top-width: 4px;' : ''; ?>"><?php echo wp_kses_post( $total['value'] ); ?></td>
					</tr>
					<?php
				}
			}
			if ( $order->get_customer_note() ) {
				?>
				<tr>
					<th class="td" scope="row" colspan="2" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php esc_html_e( 'Note:', 'woocommerce' ); ?></th>
					<td class="td" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php echo wp_kses_post( wptexturize( $order->get_customer_note() ) ); ?></td>
				</tr>
				<?php
			}
			?>
		</tfoot>
	</table>
		<?php
			global $wpdb;
    		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    		$order_data = $order->get_data();
    		$order_id = $order_data['id'];
    		 $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
		 	$table_name2 = $wpdb->prefix . "woocommerce_gift_product";        
    		$group_data = $wpdb->get_results("SELECT * FROM $table_name where order_id = '$order_id'");
    		if(!empty($group_data))
    		{
    			?>
    			<div style="text-align: center; margin-top: 10px;">
			        <h2>Gift Product Details</h2>
			        <div class="header" style="width: 100%; float: left; padding: 5px; border: 1px solid gray;">        
			            <div style="width: 25%; float: left; font-weight: bold;">Group ID</div>
			            <div style="width: 30%; float: left; font-weight: bold;">Products</div>    
			            <div style="width: 30%; float: left; font-weight: bold;">Delivery Address</div>
			            <div style="width: 10%; float: left; font-weight: bold;">Gift Wrap</div>   
			        </div>
    			<?php 
    			
    			foreach($group_data as $group) 
       			{
       				 ?>
        <div class="row" style="width: 100%; float: left; border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;">
            <div class="group-name" style="width: 25%; float: left;"><?php echo $group->group_id; ?></div>            
            <div style="width: 30%; float: left;">
                <?php
           			 $product_data = $wpdb->get_results("SELECT * FROM $table_name2 where group_id = '$group->group_id'");
           			// var_dump($product_data);
		            foreach ($product_data as $product)
		            {
		                $product_id = explode('_', $product->product_id);
		                if($product_id[1] == 0){
		                    $product_id = $product_id[0];
		                }
		                else{
		                    $product_id = $product_id[1];
		                }
		               	$product_info = wc_get_product( $product_id );
		                $product_data = $product_info->get_data();
		            ?>
		                <div class ="product-row" style="width: 100%;">
		                    <div class="thumb" style="float: left; width: 50%; clear: both;">
		                  <img src="<?php echo get_the_post_thumbnail_url($product_info->get_id(), 'full') ?>"style="margin:10px 0px;" width="100%" height="auto" class="prod_img" />
		                      </div>
		                       <div class="thumb" style="float: left; width: 50%; text-align: left;">
			                      <h5 style="margin: 5px;"><?php echo $product_data['name']; ?></h5>
			                      <span>Qty <?php echo $product->qty; ?></span>
			                    </div>
		                      </div>
		                      <?php
		            }
		            ?>
		            </div>            
            <div class="address_details" style="width: 30%; float: left; text-align: left;">
            	<p><?php echo $group->delivery_add; ?> - <?php echo $group->postcode; ?></br></p>
            	<b> Email: </b><?php echo $group->email; ?></br>
            	<b> Phone: </b><?php echo $group->phone; ?> 
            </div>
             <div style="width: 10%; float: left; font-weight: bold;"><?php if($group->gift_wrap == 1){ echo 'Yes'; } else{
              echo 'No'; } ?></div>
        </div>
		            <?php
           		}
    		}

    	?>
</div>

<?php do_action( 'woocommerce_email_after_order_table', $order, $sent_to_admin, $plain_text, $email ); ?>
